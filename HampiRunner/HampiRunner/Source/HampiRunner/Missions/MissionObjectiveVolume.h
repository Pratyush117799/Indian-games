#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Volume.h"
#include "MissionObjectiveVolume.generated.h"

class AMissionManager;

UCLASS()
class HAMPIRUNNER_API AMissionObjectiveVolume : public AVolume
{
	GENERATED_BODY()

public:
	AMissionObjectiveVolume();

protected:
	virtual void BeginPlay() override;

	UPROPERTY(EditAnywhere, Category="Mission")
	FName ObjectiveStageId;

	UPROPERTY(EditAnywhere, Category="Mission")
	TSoftObjectPtr<AMissionManager> MissionManagerRef;

	UFUNCTION()
	void OnOverlapBegin(AActor* OverlappedActor, AActor* OtherActor);
};
